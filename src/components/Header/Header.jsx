import Image from "next/image";
import logo from "../../../public/img/symbolrush-rogne.png";

export default function Header() {
    return (
        <header className="absolute top-0 left-0">
            <h1 className="m-2">
                <Image src={logo} width={120} alt="Logo SymbolRush" />
            </h1>
        </header>
    );
}
