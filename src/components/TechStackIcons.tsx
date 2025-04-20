import { getTechLogos } from "@/lib/utils";
import Image from "next/image";

const TechStackIcons = async ({techStack}:TechIconProps) => {
    const techResult = await getTechLogos(techStack);
  return (
    <div className="flex">
        {
          techResult.slice(0,3).map(({tech,url}) => ( 
            <div key={tech} className="rounded-full bg-dark-300 p-2 flex-center">
                <span className="tech-tooltip">{tech}</span>
                <Image src={url} alt={tech} width={100} height={100} className="size-5" />
                </div>
          ))
        }
      
    </div>
  )
}

export default TechStackIcons
