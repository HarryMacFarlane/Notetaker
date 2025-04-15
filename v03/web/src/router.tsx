import { BrowserRouter} from "react-router-dom"
import { ChildrenInput } from "./util/childrenInterface"

export const AppRouter : React.FC<ChildrenInput> = ({children}) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    )
}