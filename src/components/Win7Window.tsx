import type { ReactNode } from 'react';

type Props = {
	title: string;
	children: ReactNode;
	/** Glass (translucent) frame. Off gives the solid blue Win7 frame. */
	glass?: boolean;
	/** White body instead of Win7's grey */
	bright?: boolean;
	/** Padding inside the body */
	padded?: boolean;
	className?: string;
	bodyClassName?: string;
	as?: 'section' | 'article' | 'aside' | 'div' | 'header';
	labelledBy?: string;
};

/** A Windows 7 window from 7.css. The title-bar controls are decoration only: hidden from assistive tech and unclickable (see globals.css). */
export function Win7Window({
	title,
	children,
	glass = true,
	bright = true,
	padded = true,
	className,
	bodyClassName,
	as: Tag = 'section',
	labelledBy,
}: Props) {
	const classes = ['window', 'active', glass && 'glass', bright && 'is-bright', className].filter(Boolean).join(' ');
	const bodyClasses = ['window-body', padded && 'has-space', bodyClassName].filter(Boolean).join(' ');

	return (
		<Tag className={classes} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : title}>
			<div className="title-bar">
				<div className="title-bar-text">{title}</div>
				<div className="title-bar-controls" aria-hidden="true">
					<button aria-label="Minimize" tabIndex={-1} type="button" />
					<button aria-label="Maximize" tabIndex={-1} type="button" />
					<button aria-label="Close" tabIndex={-1} type="button" />
				</div>
			</div>
			<div className={bodyClasses}>{children}</div>
		</Tag>
	);
}
