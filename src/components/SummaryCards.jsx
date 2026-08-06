// Componente reutilizable que recibe un arreglo de tarjetas por props
// y las renderiza con map(). Ejemplo de props: [{ label, value }, ...]
export default function SummaryCards({ cards }) {
  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div className="summary-card" key={card.label}>
          <div className="value mono">{card.value}</div>
          <div className="label">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
