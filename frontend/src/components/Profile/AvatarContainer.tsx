interface useUserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string
}

interface AvatarContainerInterface {
    useUserStore: useUserStoreInterface
}

const AvatarContainer = ({ useUserStore }: AvatarContainerInterface) => {
    const AvatarForm = new FormData();
    return (
        <>
        <img id="avatar_img" className="max-w-28 max-h-28 w-full h-28 aspect-square rounded-[100%]" src={useUserStore.avatar ? `${import.meta.env.VITE_API_URL}/${useUserStore.avatar}` : `${import.meta.env.VITE_API_URL}/uploads/avatars/default.jpg`} />
        <input className="hidden" type="file" id="avatar_file" accept="image/*" onChange={e => {
            const file = e.target.files![0];
            const reader = new FileReader();
            const img: HTMLImageElement = (document.getElementById('avatar_img')! as HTMLImageElement);

            if (file) {
                reader.onload = () => {
                    img.src = String(reader.result);
                }
                reader.readAsDataURL(file)
                AvatarForm.set('avatar', file);
            }
        }} />
        <button className="bg-(--respect-purple-dark) mb-2 px-3 py-2 rounded-lg" onClick={e => {
            const input: HTMLElement = e.currentTarget.parentElement!.querySelector('input[type=file]') as HTMLElement;
            input.click();
        }}>Загрузить файл</button>
        </>
    )
}

export default AvatarContainer;