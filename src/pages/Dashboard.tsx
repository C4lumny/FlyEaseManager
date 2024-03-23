import { Archive, ArchiveX, File, Inbox, Send, Trash2 } from "lucide-react";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import FlyEaseIcon from "../assets/Logo-removebg-preview.png";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";

export const Dashboard = () => {
  return (
    <div className="container relative hidden h-screen flex-col md:grid lg:max-w-none lg:grid-cols-6 lg:px-0">
      <div className="col-span-1 flex flex-col">
        {/* 👇 Logo del aplicativo */}
        <div className="mt-10">
          <img src={FlyEaseIcon} alt="" />
        </div>
        {/* 👇 Separador */}
        <div className="mx-5 mb-5">
          <Separator />
        </div>
        {/* 👇 Nav y opciones del aplicativo */}
        <div className="">
          <TooltipProvider>
            <Nav
              isCollapsed={false}
              links={[
                {
                  title: "Inbox",
                  label: "128",
                  icon: Inbox,
                  variant: "default",
                },
                {
                  title: "Drafts",
                  label: "9",
                  icon: File,
                  variant: "ghost",
                },
                {
                  title: "Sent",
                  label: "",
                  icon: Send,
                  variant: "ghost",
                },
                {
                  title: "Junk",
                  label: "23",
                  icon: ArchiveX,
                  variant: "ghost",
                },
                {
                  title: "Trash",
                  label: "",
                  icon: Trash2,
                  variant: "ghost",
                },
                {
                  title: "Archive",
                  label: "",
                  icon: Archive,
                  variant: "ghost",
                },
              ]}
            />
          </TooltipProvider>
          
        </div>
      </div>
      <div className="">
          <Separator orientation="vertical" />
        </div>
      <div className="ml-10 col-span-5"></div>
    </div>
  );
};
