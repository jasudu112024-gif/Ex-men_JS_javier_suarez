/**
 * Web Component personalizado que representa una tarjeta visual de evento.
 * Extiende HTMLElement y utiliza Shadow DOM para encapsular estilos.
 */
class EventoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Se ejecuta automáticamente al insertar el elemento en el DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Construye el HTML interno del componente a partir de sus atributos.
   * Renderiza imagen, nombre, descripción, meta y botón de agregar al carrito.
   */
  render() {
    const id = this.getAttribute('data-id');
    const nombre = this.getAttribute('nombre') || '';
    const ciudad = this.getAttribute('ciudad') || '';
    const fecha = this.getAttribute('fecha') || '';
    const hora = this.getAttribute('hora') || '';
    const precio = this.getAttribute('precio') || '0';
    const imagen = this.getAttribute('imagen') || '';
    const categoria = this.getAttribute('categoria') || '';
    const descripcion = this.getAttribute('descripcion') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #1c0b0b; /* Fondo oscuro que combina con tu CSS */
          border: 1px solid rgba(229, 193, 88, 0.15); /* Borde dorado tenue */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }

        :host(:hover) {
          transform: translateY(-5px);
          border-color: #f9d24b; /* Dorado brillante en hover */
          box-shadow: 0 12px 30px rgba(139, 24, 24, 0.4);
        }

        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid rgba(229, 193, 88, 0.15);
        }

        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .categoria {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f9d24b; /* Texto dorado para la categoría */
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        h3 {
          margin: 0;
          font-family: 'Cinzel', serif; /* Tu fuente teatral */
          font-size: 1.25rem;
          color: #ffffff;
          line-height: 1.3;
        }

        p {
          margin: 0;
          color: #d8c28b; /* Crema dorado suave para la descripción */
          font-size: 0.9rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .meta {
          font-size: 0.85rem;
          color: #eee2c5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding: 0.5rem 0;
          border-top: 1px solid rgba(229, 193, 88, 0.1);
          margin-top: 0.25rem;
        }

        .price {
          color: #ffeea8;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .actions {
          display: flex;
          margin-top: 0.5rem;
        }

        .add-button {
          width: 100%;
          border: 1px solid #f9d24b;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          background: #8b1818; /* Botón rojo infernal */
          color: #ffeea8;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }

        .add-button:hover {
          background: #a81f1f;
          box-shadow: 0 0 10px rgba(139, 24, 24, 0.6);
        }

        .add-button:active {
          transform: scale(0.98);
        }
      </style>
      <img class="card-image" src="${imagen}" alt="${nombre}" loading="lazy" />
      <div class="card-body">
        <div class="categoria">${categoria}</div>
        <h3>${nombre}</h3>
        <p>${descripcion}</p>
        <div class="meta">
          <span>${fecha} · ${hora} · ${ciudad}</span>
          <span class="price">${precio}</span>
        </div>
        <div class="actions">
          <button class="add-button" type="button">Agregar al carrito</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.add-button')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('add-to-cart', {
        detail: { id },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('evento-card', EventoCard);