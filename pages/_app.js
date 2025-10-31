// pages/_app.js
import '../styles/globals.css'
import { AllianzProvider } from '../context/AllianzContext'

export default function App({ Component, pageProps }) {
  return (
    <AllianzProvider>
      <Component {...pageProps} />
    </AllianzProvider>
  )
}
