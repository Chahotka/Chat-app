import cl from '../../../../styles/client.module.css'

interface Props {
  clientId: string
  provideRef: Function
}

const Client: React.FC<Props> = ({ clientId, provideRef}) => {
  return (
    <li key={clientId} className={cl.clientBox}>
      <video 
        ref={instance => {
          provideRef(clientId, instance)
        }}
        autoPlay
        playsInline
        className={cl.clientMedia}
      />
    </li>
  )
}

export default Client