export default function EmptyState({title='Nessun dato',text='Aggiungi il primo elemento per iniziare.',action}){ return <div className="empty"><h3>{title}</h3><p>{text}</p>{action}</div>; }
