export default function StatCard({label,value,help}){ return <div className="statCard"><span>{label}</span><strong>{value ?? 0}</strong>{help && <small>{help}</small>}</div>; }
