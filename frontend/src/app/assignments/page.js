import Link from 'next/link';
import styles from './assignments.module.scss'

const Assignments = async () => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        // next: { revalidate: 3600 }
        method:'GET',
        credentials: 'include'
    } )
    const response = await res.json();
    const assignments = response.data;

    return (
        <div className={styles.container}>
          <div className={styles.assignments}>
            <div className={styles.assignments_th}>
              <p>PROBLEM NAME</p>
              <p>DIFFICULTY</p>
            </div>
            { assignments.map(a => (
                <div key={a._id} className={styles.assignments_row} >
                    <Link className={styles.assignments_link} href={`/assignments/${a._id}`}>{ a.title }</Link>
                    <p className={styles.assignments_dif}>{ a.description }</p>
                </div>
            ))}
          </div>
        </div>
    )
}

export default Assignments;