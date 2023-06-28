import MainLayout from "@/src/components/Layout/main-layout"
import styles from "../styles/global.css"


export default function App({ Component, pageProps }) {
  return (
    <>
      <MainLayout>
        <Component {...pageProps} />;
      </MainLayout>
    </>
  )

}