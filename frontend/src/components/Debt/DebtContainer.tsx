import { ImUndo2 } from "react-icons/im"
import { Link } from "react-router-dom"
import useUserStore from "../../store/userStore"
import ProfileLink from "../Profile/ProfileLink"
import { DebtView } from "./DebtView"


export const DebtContainer = ()=>{
    return(
        <>
        <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:mb-12">
                <ProfileLink className="order-2 sm:order-1 w-full sm:w-fit" useUserStore={useUserStore()} />
                <Link className="order-1 sm:order-2 flex flex-row items-center justify-center gap-2 w-full text-center sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep]" to="/">На главную <ImUndo2 />
                </Link>
            </div>
            <DebtView/>
        </div>
        </>
    )
}