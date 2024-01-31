import emailjs from '@emailjs/browser'
import { useAppSelector } from '../../app/hooks'

export const useEmailSender = (email: string, nick: string,) => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const userID = useAppSelector(state => state.user.id)

  const userInfo = {
    send_to: email,
    to_name: nick,
    send_link: `${baseUrl}/user-confirmation/${userID}`
  }

  const sendMail = async () => {
    emailjs.send(
      `${process.env.REACT_APP_SERVICE_ID}`, 
      `${process.env.REACT_APP_TEMPLATE_ID}`, 
      userInfo, 
      `${process.env.REACT_APP_PUBLIC_KEY}`
    )
  }


  return sendMail
}