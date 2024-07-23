import {IconType} from "react-icons";


interface IconData {
    icon:IconType
}

export const getIcon = ({icon}:IconData) => {
    return [icon];
}