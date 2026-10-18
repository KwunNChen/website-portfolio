import type { Project } from '@/content/projects';
import styles from '@/app/pages.module.css';

export function StatusBadge({ status }: { status: Project['status'] }) {
	return status === 'complete' ? (
		<span className={`${styles.status} ${styles.complete}`}>Complete</span>
	) : (
		<span className={`${styles.status} ${styles.inProgress}`}>In progress</span>
	);
}
