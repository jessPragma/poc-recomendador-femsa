import { NgClass } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuestionRequest, Request } from '@core/interfaces/question.interface';
import { UserBankia } from '@core/interfaces/user-bankia.interface';
import { CartItem } from '@core/models/cart-item.model';
import { AgentService } from '@core/services/agent/agent.service';
import { CartService } from '@core/services/cart/cart.service';
import { QuestionService } from '@core/services/question/question.service';
import { TextService } from '@core/services/text/text.service';
import { UserService } from '@core/services/user/user.service';
import { WsAgentService } from '@core/services/wsAgent/ws-agent.service';
import { ACustomInputTextComponent } from '@ui/atoms/a-custom-input-text/a-custom-input-text.component';
import { AtomsModule } from '@ui/atoms/atoms.module';
import { Observable } from 'rxjs';
import { ACardChatComponent } from '../../atoms/a-card-chat/a-card-chat.component';

@Component({
	selector: 't-modal',
	standalone: true,
	imports: [AtomsModule, NgClass, ACardChatComponent],
	templateUrl: './t-modal.component.html',
	styleUrl: './t-modal.component.scss'
})
export class TModalComponent implements OnInit, AfterViewInit, OnDestroy {
	private readonly wsAgentService = inject(WsAgentService);
	private readonly agentService = inject(AgentService);
	private readonly userService = inject(UserService);
	private readonly questionService = inject(QuestionService);
	private readonly formatTextService = inject(TextService);
	private readonly sanitizer = inject(DomSanitizer);
	private readonly cartService = inject(CartService);

	user: UserBankia = this.userService.getUser();
	messages$!: Observable<string>; // Observable para los mensajes
	connection = this.wsAgentService.connect(
		'wss://khjsq2bote.execute-api.us-east-1.amazonaws.com/dev/'
	);


	ngOnDestroy(): void {
		this.questionService.setUser({ usuario: '', sessionId: '', password: '' });
		this.wsAgentService.closeConnection();
	}

	ngOnInit(): void {
		this.defaultQuestion = this.questionService.getDefaultQuestions();
		this.listenerWebSocket();
		
		// Exponer el componente para interacción con JavaScript
		(window as any).angularComponentRef = this;
		
		// Agregar un listener global para los eventos de addToCart
		document.addEventListener('addToCart', (e: any) => {
			console.log('Evento addToCart recibido:', e.detail);
			this.addToCart(e.detail);
		});
		
		// Inicializar el contador del carrito si hay productos en localStorage
		this.initializeCartBadge();
	}

	chats: { text: SafeHtml; isUser: boolean }[] = [];

	valueInput = '';
	isInputEmpty = false;
	isDisableInput = false;
	isTyping = false; // Bandera para indicar si está "escribiendo"
	welcome = true;
	defaultQuestion: Request[] = [];
	selectedButtonIndex: number = -1; // Índice del botón seleccionado

	@ViewChild('chatContainer') chatContainer!: ElementRef;
	@Output() onclose = new EventEmitter<void>();

	@ViewChild(ACustomInputTextComponent, { static: false })
	inputText!: ACustomInputTextComponent;

	handleClose(): void {
		this.onclose.emit();
	}

	handleInputChanged(value: boolean): void {
		this.isInputEmpty = value;
	}

	handleDebouncedInput(value: string): void {
		this.valueInput = value;
		if (this.valueInput) {
			this.welcome = false;
			this.chats.push({
				text: this.valueInput,
				isUser: true
			});
			this.sendMessageWSocket(this.valueInput);
		}
	}

	sendDefaultQuestion(question: Request, index: number): void {
		if (question.prompt) {
			this.selectedButtonIndex = index;
			this.welcome = false;
			this.valueInput = question.text;
			this.chats.push({
				text: this.valueInput,
				isUser: true
			});
			this.sendMessageWSocket(this.valueInput);
		}
	}

	sendQuestion(): void {
		this.valueInput = this.inputText.currentValue;
		if (this.valueInput.length <= 0) return;
		if (this.valueInput.trim()) {
			this.chats.push({
				text: this.valueInput,
				isUser: true
			});
			this.welcome = false;
		}
		this.inputText.clearInputFrom();
		this.sendMessageWSocket(this.valueInput);
	}

	ngAfterViewInit(): void {
		this.scrollToBottom();
	}

	private scrollToBottom(): void {
		if (this.chatContainer) {
			const container = this.chatContainer.nativeElement;
			if (container) {
				container.scrollTop = container.scrollHeight;
				setTimeout(() => {
					container.scrollTop = container.scrollHeight;
				}, 100);
			}
		}
	}

	sendMessageWSocket(message: string): void {
		this.isInputEmpty = false;
		this.isDisableInput = true;
		this.isTyping = true;
		this.wsAgentService.sendMessage(message);
	}

	tryFocusInput(): void {
		if (!this.inputText.disableInput) {
			this.inputText.resetHeight();
			this.inputText.focusInput();
		} else {
			let attempts = 0;
			const maxAttempts = 5;

			const retryFocus = () => {
				if (attempts < maxAttempts) {
					setTimeout(() => {
						if (!this.inputText.disableInput) {
							this.inputText.resetHeight();
							this.inputText.focusInput();
						} else {
							attempts++;
							retryFocus();
						}
					}, 1000);
				}
			};

			retryFocus();
		}
	}

	private handleWebSocketMessage(
		message: string,
		timeoutDuration: number,
		inactivityTimeout: any
	): void {
		this.reiniciarTemporizador(timeoutDuration, inactivityTimeout);
		
		// Detectar si es un mensaje que contiene productos
		const products = this.extractProductsFromMessage(message);
		if (products.length === 0) {
			// Si no hay productos, seguir con el flujo normal
			this.updateChatList();
			this.updateLastChatMessage(message);
		} else {
			// Si hay productos, procesar y añadir como mensajes separados
			this.processAndAddProductMessageParts(message, products);
		}
		
		setTimeout(() => this.scrollToBottom(), 0);
	}

	private updateChatList(): void {
		if (this.chats.length === 0 || this.chats[this.chats.length - 1].isUser) {
			this.chats.push({ isUser: false, text: '' });
			this.isTyping = false;
		}
	}

	private updateLastChatMessage(message: string): void {
		// Verificar si es un mensaje que contiene productos
		const products = this.extractProductsFromMessage(message);
		
		if (products.length > 0) {
			// Procesar mensaje con productos (dividido en 3 partes)
			this.processAndAddProductMessageParts(message, products);
		} else {
			// Procesar mensaje normal
			const formattedMessage = this.formatMessageAsList(message);
			const sanitizeMessage = this.sanitizeMessage(formattedMessage);
			this.chats[this.chats.length - 1].text = sanitizeMessage;
		}
	}

	listenerWebSocket(): void {
		console.log('Conexión WebSocket:', this.connection);

		const timeoutDuration = 100;
		let inactivityTimeout: any;

		this.wsAgentService.messages$.subscribe({
			next: (message: string) =>
				this.handleWebSocketMessage(message, timeoutDuration, inactivityTimeout),
			error: (error) => this.handleWebSocketError(error)
		});

		this.reiniciarTemporizador(timeoutDuration, inactivityTimeout);
	}

	private finalizarPorInactividad(): void {
		console.log('No se recibieron mensajes en el tiempo establecido. Finalizando.');
		this.habilitarBotones();
	}

	private reiniciarTemporizador(timeoutDuration: number, inactivityTimeout: any): void {
		if (inactivityTimeout) {
			clearTimeout(inactivityTimeout);
		}
		inactivityTimeout = setTimeout(() => this.finalizarPorInactividad(), timeoutDuration);
	}

	private handleWebSocketError(error: any): void {
		console.error('Error WebSocket:', error);
	}

	habilitarBotones(): void {
		this.isDisableInput = false;
		this.tryFocusInput();
		this.isInputEmpty = true;
	}

	// Variables para seguimiento del carrito
	cartItems: CartItem[] = [];
	cartCount: number = 0;

	initializeCartBadge(): void {
		// Suscribirse a los cambios del carrito usando el servicio
		this.cartService.cartItems$.subscribe(items => {
			this.cartItems = items;
			this.updateCartCount();
		});
		
		// Asegurarse de que existe el elemento de la insignia del carrito
		const cartIcon = document.querySelector('.cart-icon') || document.querySelector('.icon-cart');
		if (cartIcon && !document.querySelector('.cart-badge')) {
			const badge = document.createElement('span');
			badge.className = 'cart-badge';
			badge.textContent = this.cartCount.toString();
			badge.style.display = this.cartCount > 0 ? 'block' : 'none';
			cartIcon.appendChild(badge);
		}
	}

	updateCartCount(): void {
		this.cartCount = this.cartService.getTotalUnits();
		// Actualizar el contador del carrito en el header
		const cartBadge = document.querySelector('.cart-badge') as HTMLElement;
		if (cartBadge) {
			cartBadge.textContent = this.cartCount.toString();
			cartBadge.style.display = this.cartCount > 0 ? 'block' : 'none';
		}
	}

	addToCart(product: any): void {
		console.log('Agregando producto al carrito:', product);
		
		// Convertir el producto al formato CartItem
		const cartItem: CartItem = {
			id: Math.random().toString(36).substring(2, 15),
			name: product.name,
			// Usar siempre 'Generic' como marca por defecto
			brand: 'Generic',
			// Extraer solo números del precio (quitar signos de moneda)
			price: parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
			quantity: product.quantity || 1,
			image: product.imageUrl,
			// Descuento siempre en $0
			discount: 0
		};
		
		// Agregar el producto al carrito usando el servicio
		this.cartService.addToCart(cartItem);
		
		// Actualizar el contador del carrito
		this.updateCartCount();
		
		// Mostrar confirmación visual
		this.showAddToCartConfirmation(product.name);
	}

	private formatMessageAsList(message: string): string {
		// Este método ahora solo procesa mensajes normales sin productos
		// La lógica para mensajes con productos se ha movido a processProductMessage
		
		// Si el mensaje contiene productos, manejar de forma especial
		const products = this.extractProductsFromMessage(message);
		if (products.length > 0) {
			return this.processProductMessage(message, products);
		}
		
		// Procesamiento normal para mensajes sin productos
		const lines = message.split('\n');
		const formattedListItems: string[] = [];
		let isOrderedList = false;
		
		// Procesar el resto del mensaje
		lines.forEach((line) => {
			const trimmedLine = line.trim();
			// Saltarse las líneas que ya fueron procesadas como productos
			if (trimmedLine.match(/^-\s*Nombre:/i) || 
				trimmedLine.match(/^-\s*Precio:/i) || 
				trimmedLine.match(/^-\s*URL\s*imagen:/i)) {
				return;
			}
			
			if (trimmedLine.startsWith('{"message":') || trimmedLine.startsWith(' {"message":')) {
				formattedListItems.push(`<li>Continuamos trabajando en tu solicitud...</li>`);
			}
			else if (trimmedLine.startsWith('- Imagen') || trimmedLine.startsWith('- URL') || trimmedLine.startsWith('- **Imagen:**') || trimmedLine.startsWith('- **URL ')) {
				formattedListItems.push(`<li>
					<img src="https://${trimmedLine.split('https://')[2]}" alt="" style="max-width: 50%;margin: auto;border-radius: 10px;" />
				</li>`);
				return;
			}
			// Verificar si es una lista de puntos (• o -)
			else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
				formattedListItems.push(`<li>${trimmedLine}</li>`);
				isOrderedList = false;
			}
			// Verificar si es una lista numerada (inicia con "1.", "2.", etc.)
			else if (/^\d+\./.test(trimmedLine)) {
				formattedListItems.push(`<li>${trimmedLine}</li>`);
				isOrderedList = true;
			}
			// Mantener las líneas no relacionadas con listas sin formato
			else {
				formattedListItems.push(trimmedLine);
			}
		});
		
		// Envolver las líneas formateadas en <ul> o <ol> si contienen elementos de lista
		if (formattedListItems.some(line => line.startsWith('<li>'))) {
			return isOrderedList 
				? `<ol>${formattedListItems.join('\n')}</ol>` 
				: `<ul>${formattedListItems.join('\n')}</ul>`;
		}
		
		// Si solo hay productos y no elementos de lista, devolver solo las tarjetas de producto
		if (products.length > 0) {
			return formattedListItems.join('\n');
		}
		
		// Si no contiene elementos de lista ni productos, devolver el mensaje sin modificar
		return message;
	}
	
	private extractProductsFromMessage(message: string): any[] {
		const products: any[] = [];
		const lines = message.split('\n');
		
		let currentProduct: any = {};
		let foundProductSection = false;
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			
			// Detectar sección de productos
			if (line.match(/^PRODUCTOS?:?$/i)) {
				foundProductSection = true;
				continue;
			}
			
			// Comprobar diferentes formatos para el nombre del producto (mayúsculas/minúsculas)
			if (line.match(/^-\s*Nombre:/i)) {
				// Si ya estábamos procesando un producto, guardarlo y comenzar uno nuevo
				if (Object.keys(currentProduct).length > 0) {
					products.push({...currentProduct});
					currentProduct = {};
				}
				
				currentProduct.name = line.replace(/^-\s*Nombre:/i, '').trim();
				foundProductSection = true; // Si encontramos un nombre de producto, estamos en sección de productos
			} 
			// Comprobar diferentes formatos para el precio (mayúsculas/minúsculas)
			else if (line.match(/^-\s*Precio:/i)) {
				currentProduct.price = line.replace(/^-\s*Precio:/i, '').trim();
			} 
			// Comprobar diferentes formatos para la URL de la imagen (mayúsculas/minúsculas)
			else if (line.match(/^-\s*URL\s*imagen:/i)) {
				// Extraer la URL de la imagen usando una expresión regular más general
				const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
				if (urlMatch && urlMatch[1]) {
					currentProduct.imageUrl = urlMatch[1].trim();
				}
			}
			
			// Si hemos recopilado todos los datos del producto, agregarlo a la lista
			if (currentProduct.name && currentProduct.price && currentProduct.imageUrl) {
				products.push({...currentProduct});
				currentProduct = {};
			}
		}
		
		// Agregar el último producto si quedó pendiente
		if (Object.keys(currentProduct).length > 0 && currentProduct.name) {
			products.push(currentProduct);
		}
		
		console.log('Productos extraídos:', products);
		return products;
	}
	
	private createProductCardsHtml(products: any[]): string {
		console.log('Creando tarjetas para productos:', products);
		if (!products || products.length === 0) {
			console.warn('No hay productos para mostrar');
			return '';
		}
		// Contenedor para todas las tarjetas de productos
		let html = `<div class="product-grid" id="product-container">`;
		
		// Crear tarjeta para cada producto
		products.forEach((product, index) => {
			const productId = `product-${Date.now()}-${index}`;
			html += `
		<div class="chat-item" data-product-id="${productId}">
			<div class="chat-item__image"><img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; max-height: 100px; object-fit: contain;"></div>
			<div class="chat-item__details">
				<div>
					<div class="chat-item__name">${product.name}</div>
				</div>
				<div class="chat-item__controls">
					<div class="chat-item__quantity">
						<button class="quantity-btn quantity-btn--minus">−</button>
						<input type="text" value="1" class="quantity-input">
						<button class="quantity-btn quantity-btn--plus">+</button>
					</div>
					<div class="chat-item__price">${product.price}</div>
				</div>
			</div>
			<div class="chat-item__delete"><a-logo ng-reflect-src="icons/trash.svg"><figure><img title="logo" src="icons/trash.svg"></figure></a-logo></div>
			<button class="chat-item__add-btn" data-product-id="${productId}" onclick="document.dispatchEvent(new CustomEvent('addToCart', { detail: {name: '${product.name}', price: '${product.price}', imageUrl: '${product.imageUrl}', brand: 'Generic', discount: 0, quantity: 1} }))">Agregar</button>
		</div>`;
		});
		
		html += `</div>
		<style>
			.chat-item {
				display: grid;
				grid-template-columns: 30% 40% 30%;
				width: 295px;
				height: 135px;
				margin: auto;
				position: relative;
				border-bottom: 1px solid #DBDBDB;
				padding: 10px 0 10px 0;
				background-color: #ffffff;
			}
			.chat-item__image {
				width: 105px;
				height: 100px;
				object-fit: contain;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 5px;
			}
			.chat-item__details {
				flex: 1;
				margin-left: 15px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.chat-item__brand-label {
				font-size: 12px;
				color: #030302;
				font-weight: 400;
				margin-bottom: 5px;
			}
			.chat-item__brand {
				font-weight: 600;
				color: #FB1909;
				margin: 2px 0;
				font-size: 16px;
				margin-bottom: 10px;
			}
			.chat-item__name {
				font-size: 11px;
			}
			.chat-item__controls {
				display: flex;
				justify-content: space-between;
				margin-top: 10px;
				flex-direction: column;
				gap: 15px;
				align-items: start;
			}
			.chat-item__quantity {
				display: flex;
				align-items: center;
			}
			.chat-item__quantity .quantity-btn {
				background: none;
				border: 1px solid #DBDBDB;
				width: 20px;
				height: 20px;
				border-radius: 3px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				background-color: #F6F7FC;
				color: #B6B6BA;
			}
			.chat-item__quantity input {
				width: 50px;
				height: 20px;
				border: 2px solid #E8E8ED;
				text-align: center;
				margin: 0 5px;
				border-radius: 5px;
			}
			.chat-item__price {
				font-weight: 400;
				font-size: 16px;
			}
			.chat-item__delete {
				position: absolute;
				top: 15px;
				right: 0;
				cursor: pointer;
				color: #FB1909;
			}
			.chat-item__add-btn {
				background-color: #FFFFFF;
				color: #FB1909;
				border: none;
				border-radius: 5px;
				padding: 5px 10px;
				cursor: pointer;
				border: 1px solid #FB1909;
				border-radius: 5px;
				height: 28px;
				margin: auto;
			}
			.chat-item__add-btn:hover {
				background-color: #FB1909;
				color: #FFFFFF;
			}
			.chat-item__add-btn:active {
				background-color: #E01000;
			}
		</style>`;
		
		return html;
	}
	
	
	

	private sanitizeMessage(message: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(message);
	}

	// Mostrar una confirmación visual temporal cuando se agrega un producto al carrito
	private showAddToCartConfirmation(productName: string): void {
		// Crear elemento de confirmación
		const confirmation = document.createElement('div');
		confirmation.className = 'add-to-cart-confirmation';
		confirmation.innerHTML = `
			<div class="confirmation-content">
				<i class="confirmation-icon">✓</i>
				<span>¡${productName} agregado al carrito!</span>
			</div>
		`;
		
		// Estilos para la confirmación
		confirmation.style.position = 'fixed';
		confirmation.style.bottom = '20px';
		confirmation.style.left = '50%';
		confirmation.style.transform = 'translateX(-50%)';
		confirmation.style.backgroundColor = '#4CAF50';
		confirmation.style.color = 'white';
		confirmation.style.padding = '10px 20px';
		confirmation.style.borderRadius = '4px';
		confirmation.style.zIndex = '1000';
		confirmation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
		confirmation.style.display = 'flex';
		confirmation.style.alignItems = 'center';
		confirmation.style.justifyContent = 'center';
		confirmation.style.fontWeight = 'bold';
		
		// Agregar al DOM
		document.body.appendChild(confirmation);
		
		// Quitar después de 3 segundos
		setTimeout(() => {
			if (confirmation.parentNode) {
				document.body.removeChild(confirmation);
			}
		}, 3000);
	}

	/**
	 * Procesa un mensaje que contiene productos y lo divide en tres partes:
	 * 1. Texto introductorio
	 * 2. Tarjetas de productos
	 * 3. Texto de conclusión
	 */
	private processAndAddProductMessageParts(message: string, products: any[]): void {
		// Divide el mensaje en líneas
		const lines = message.split('\n');
		
		// 1. Buscar texto introductorio (antes de la primera mención de producto)
		let introText = '';
		let i = 0;
		while (i < lines.length) {
			// Si encontramos un producto o una etiqueta PRODUCTOS, terminar
			if (lines[i].trim().match(/^PRODUCTOS?:?$/i) || 
			    lines[i].trim().match(/^PRODUCTO:?$/i)) {
				break;
			}
			
			if (lines[i].trim() !== '') {
				introText += lines[i] + '\n';
			}
			i++;
		}
		
		// 2. Saltar todas las líneas de productos y sus etiquetas
		while (i < lines.length) {
			// Si la línea no tiene que ver con productos y no está vacía, es posible conclusión
			if (!lines[i].match(/^-\s*Nombre:/i) && 
				!lines[i].match(/^-\s*Precio:/i) && 
				!lines[i].match(/^-\s*URL\s*imagen:/i) && 
				!lines[i].trim().match(/^PRODUCTOS?:?$/i) &&
				!lines[i].trim().match(/^PRODUCTO:?$/i) &&
				lines[i].trim() !== '') {
				// Verificamos si es una línea que separa productos o secciones
				if (!lines[i].trim().match(/^-+$/) && // línea de guiones
				    !lines[i].trim().match(/^\*+$/) && // línea de asteriscos
				    !lines[i].trim().match(/^=+$/)) { // línea de iguales
					break;
				}
			}
			i++;
		}
		
		// 3. El resto es el texto de conclusión
		let conclusionText = '';
		while (i < lines.length) {
			if (lines[i].trim() !== '') {
				conclusionText += lines[i] + '\n';
			}
			i++;
		}
		
		// Eliminar líneas vacías al principio y al final
		introText = introText.trim();
		conclusionText = conclusionText.trim();
		
		console.log('Texto introductorio:', introText);
		console.log('Productos encontrados:', products.length);
		console.log('Texto de conclusión:', conclusionText);
		
		// Crear las tarjetas de productos
		const productCardsHtml = this.createProductCardsHtml(products);
		
		// Añadir cada parte como un mensaje separado
		if (introText) {
			this.chats.push({
				text: this.sanitizeMessage(introText),
				isUser: false
			});
		}
		
		// Añadir las tarjetas de productos
		this.chats.push({
			text: this.sanitizeMessage(productCardsHtml),
			isUser: false
		});
		
		// Añadir el texto de conclusión si existe
		if (conclusionText) {
			this.chats.push({
				text: this.sanitizeMessage(conclusionText),
				isUser: false
			});
		}
	}
	
	/**
	 * Procesa un mensaje que contiene productos y devuelve el HTML formateado
	 * Este método se usa cuando se necesita formatear un mensaje completo sin dividirlo
	 */
	private processProductMessage(message: string, products: any[]): string {
		// Crear las tarjetas de productos
		const productCardsHtml = this.createProductCardsHtml(products);
		
		// Dividir el mensaje en partes: antes y después de los productos
		const lines = message.split('\n');
		let beforeProducts = '';
		let afterProducts = '';
		let foundProducts = false;
		
		for (const line of lines) {
			// Si encontramos un marcador de productos, activar la bandera
			if (line.trim().match(/^PRODUCTOS:?$/i)) {
				foundProducts = true;
				continue;
			}
			
			// Si es una línea de producto, saltarla
			if (line.match(/^-\s*Nombre:/i) || 
				line.match(/^-\s*Precio:/i) || 
				line.match(/^-\s*URL\s*imagen:/i)) {
				continue;
			}
			
			// Si no hemos llegado a productos todavía, agregar a beforeProducts
			if (!foundProducts) {
				beforeProducts += line + '\n';
			} else {
				// Si ya pasamos los productos, y no es una línea de producto, es contenido posterior
				afterProducts += line + '\n';
			}
		}
		
		// Construir el mensaje final
		let formattedMessage = '';
		if (beforeProducts.trim() !== '') {
			formattedMessage += beforeProducts.trim() + '\n\n';
		}
		
		formattedMessage += productCardsHtml;
		
		if (afterProducts.trim() !== '') {
			formattedMessage += '\n\n' + afterProducts.trim();
		}
		
		return formattedMessage;
	}


	//Agente virtual depreciado por el uso de WebSocket
	async askingTheAgent(request: QuestionRequest): Promise<void> {
		this.isInputEmpty = false;
		this.isDisableInput = true;
		this.isTyping = true;

		try {
			const response = await this.agentService.getResponseAgentAsync(request);
			const answer = this.formatTextService.formatText(response.agent_answer);
			const answerLinkFormat = this.formatTextService.generateLinkHtml(answer);
			if (response.agent_answer) {
				this.chats.push({
					text: answerLinkFormat,
					isUser: false
				});
			}
			this.isDisableInput = false;
			this.isTyping = false;
			this.tryFocusInput();
			setTimeout(() => this.scrollToBottom(), 0);
		} catch (error) {
			console.error('Error al obtener la respuesta del agente:', error);

			this.isDisableInput = false;
			this.isTyping = false;
			this.chats.push({
				text: 'Hubo un error al procesar la solicitud. Inténtalo de nuevo.',
				isUser: false
			});
			this.tryFocusInput();
			setTimeout(() => this.scrollToBottom(), 0);
		}
	}
}
