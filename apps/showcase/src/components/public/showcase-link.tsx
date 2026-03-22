"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

export default function ShowcaseLink({
  href,
  onClick,
  children,
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || isModifiedEvent(event) || props.target === "_blank" || !isInternalHref(href)) {
          return;
        }

        event.preventDefault();
        window.history.pushState({}, "", href);
        window.dispatchEvent(new Event("showcase:navigate"));
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
    >
      {children}
    </a>
  );
}
