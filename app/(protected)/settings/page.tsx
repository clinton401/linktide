import {FC} from 'react'
import {auth, signOut} from "@/auth";
 const Settings: FC = async() => {
    const session = await auth()
  return (
    <div>
    <div>{JSON.stringify(session)}</div>
    <form action={async () => {
        "use server"
        await signOut()
    }}><button type="submit">Sign out</button></form></div>
  )
}
 

export default Settings
