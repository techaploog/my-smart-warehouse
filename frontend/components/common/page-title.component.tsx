interface PageTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageTitle = ({ title, description, action }: PageTitleProps) => {
  return (
    <div className="flex-between gap-2 border-b border-slate-200 pb-2">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-2xl font-bold">{title}</h1>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
};
