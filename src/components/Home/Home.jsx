import { Header } from "../Global/Header"
import { Hero } from "./Hero"
import { Footer } from "../Global/Footer"

export const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  )
}
