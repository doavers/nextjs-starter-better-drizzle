import { ReactNode } from "react";

interface HeadingProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, icon }) => {
  return (
    <div className="flex items-center gap-3">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};
