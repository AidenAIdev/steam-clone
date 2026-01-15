import useAdminAuth from '../hooks/useAdminAuth';

const AdminDashboardPage = () => {
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/steamworks/admin-login';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Panel de Administración</h1>
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              {admin?.email || 'Administrador'}
            </span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>Bienvenido al Dashboard</h2>
          <p style={styles.welcomeText}>
            Este es el panel de administración. Aquí podrás gestionar todos los aspectos de la plataforma.
          </p>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statInfo}>
                <h3 style={styles.statTitle}>Usuarios</h3>
                <p style={styles.statValue}>Próximamente</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🎮</div>
              <div style={styles.statInfo}>
                <h3 style={styles.statTitle}>Juegos</h3>
                <p style={styles.statValue}>Próximamente</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>⚠️</div>
              <div style={styles.statInfo}>
                <h3 style={styles.statTitle}>Reportes</h3>
                <p style={styles.statValue}>Próximamente</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>🔒</div>
              <div style={styles.statInfo}>
                <h3 style={styles.statTitle}>Sanciones</h3>
                <p style={styles.statValue}>Próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1b2838',
  },
  header: {
    backgroundColor: '#171a21',
    borderBottom: '1px solid #2a475e',
    padding: '20px',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    color: '#8f98a0',
    fontSize: '14px',
  },
  logoutButton: {
    backgroundColor: '#c94d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  welcomeCard: {
    backgroundColor: '#212b36',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  welcomeText: {
    color: '#8f98a0',
    fontSize: '16px',
    marginBottom: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: '#1b2838',
    borderRadius: '6px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: '1px solid #2a475e',
  },
  statIcon: {
    fontSize: '32px',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    color: '#8f98a0',
    fontSize: '14px',
    fontWeight: 'normal',
    margin: '0 0 5px 0',
  },
  statValue: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
};

export default AdminDashboardPage;
