import { sayHello } from "@realmix/protocol"

function App() {

  const onClick = () => {
    sayHello();
  }

  return (
    <>
      <button onClick={onClick}>say hello</button>
    </>
  )
}

export default App
