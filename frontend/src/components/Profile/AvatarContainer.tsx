import { useRef } from "react"

interface useUserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string
}

interface AvatarContainerInterface {
    useUserStore: useUserStoreInterface,
    setAvatar: (file: File) => void
}

const AvatarContainer = ({ useUserStore, setAvatar }: AvatarContainerInterface) => {
    const imgRef = useRef<HTMLImageElement>(null)
    return (
        <>
        <img  ref={imgRef} className="max-w-28 max-h-28 w-full h-28 aspect-square rounded-[100%]" src={useUserStore.avatar ? `${import.meta.env.VITE_API_URL}/${useUserStore.avatar}` : `${import.meta.env.VITE_API_URL}/uploads/avatars/default.jpg`} />
        <input className="hidden" type="file"  accept="image/*" onChange={e => {
            const file = e.target.files![0];
            const reader = new FileReader();
            if (file) {
                reader.onload = () => {
                    if(imgRef.current){
                        imgRef.current.src = String(reader.result);
                    }
                    
                }
                reader.readAsDataURL(file)
                setAvatar(file);
            }
        }} />
        <button className="bg-[--respect-purple-dark] mb-2 px-3 py-2 rounded-lg" onClick={e => {
            const input: HTMLElement = e.currentTarget.parentElement!.querySelector('input[type=file]') as HTMLElement;
            input.click();
        }}>Загрузить файл</button>
        </>
    )
}

export default AvatarContainer;