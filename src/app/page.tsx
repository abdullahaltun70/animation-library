import Image from 'next/image'
import styles from './page.module.css'
import Fade from '@/animations/fade'

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Home pagina</h1>
      <Fade in={true} duration={1} delay={0.5}>
        <h1>Hello World!</h1>
      </Fade>
    </div>
  )
}
