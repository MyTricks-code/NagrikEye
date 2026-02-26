import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardMap from '../components/DashboardMap';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const container = useRef();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarCollapsed(true);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, navigate]);

    useGSAP(() => {
        if (loading || !container.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.dash-header', {
            y: -20, opacity: 0, duration: 0.6
        })
            .from('.stats-grid', {
                y: 20, opacity: 0, duration: 0.6
            }, '-=0.3')
            .from('.map-section', {
                y: 20, opacity: 0, duration: 0.6
            }, '-=0.2');

    }, { scope: container, dependencies: [loading] });

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const stats = {
        total: reports.length,
        pending: reports.filter(r => !r.status || r.status === 'pending').length,
        resolved: reports.filter(r => r.status === 'resolved').length
    };

    const DEPT_CONFIG = [
        { key: 'hazard',      label: 'Hazard',       icon: '⚠️', color: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-100', link: '/admin-reports?dept=hazard' },
        { key: 'social',      label: 'Social',        icon: '🏘️', color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-100',   link: '/admin-reports?dept=social' },
        { key: 'electricity', label: 'Electricity',   icon: '⚡', color: 'text-yellow-500', bg: 'bg-yellow-50',  border: 'border-yellow-100', link: '/admin-reports?dept=electricity' },
        { key: 'gas',         label: 'Gas',           icon: '🔥', color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-100',    link: '/admin-reports?dept=gas' },
        { key: 'municipal',   label: 'Municipal',     icon: '🚰', color: 'text-teal-500',   bg: 'bg-teal-50',    border: 'border-teal-100',   link: '/admin-reports?dept=municipal' },
    ];

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F2]">Loading...</div>;

    return (
        <div ref={container} className="min-h-screen bg-[#F5F5F2] font-sans flex text-[#1a1a1a]">

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onLogout={handleLogout}
                isMobile={isMobile}
            />

            <main
                className="flex-1 transition-all duration-500 ease-in-out p-6 lg:p-12 w-full"
                style={{ marginLeft: isMobile ? '0px' : (isSidebarCollapsed ? '80px' : '280px') }}
            >
                <div className="max-w-[1600px] mx-auto">

                    <div className="dash-header mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">

                        {isMobile && (
                            <div className="w-full flex items-center justify-between mb-2">
                                <button
                                    onClick={() => setIsSidebarCollapsed(false)}
                                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm text-[#1a1a1a] active:scale-95 transition-transform"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                </button>
                                <div className="text-sm font-bold text-[#8ED462] tracking-wider uppercase">NagrikEye</div>
                            </div>
                        )}

                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
                            <p className="text-stone-500">Welcome back, Admin</p>
                        </div>
                    </div>

                    <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Total Reports</div>
                            <div className="text-5xl font-bold text-[#1a1a1a] mb-2">{stats.total}</div>
                            <div className="text-stone-400 text-sm">Lifetime issues reported</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Pending</div>
                            <div className="text-5xl font-bold text-orange-500 mb-2">{stats.pending}</div>
                            <div className="text-orange-300 text-sm">Requires attention</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                            <div className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-1">Resolved</div>
                            <div className="text-5xl font-bold text-[#8ED462] mb-2">{stats.resolved}</div>
                            <div className="text-[#8ED462]/80 text-sm">Successfully fixed</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-4 text-[#1a1a1a]">Issues by Department</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {DEPT_CONFIG.map(dept => {
                                const count = reports.filter(r => (r.reportType || 'hazard') === dept.key).length;
                                const pending = reports.filter(r => (r.reportType || 'hazard') === dept.key && (!r.status || r.status === 'pending')).length;
                                return (
                                    <Link
                                        key={dept.key}
                                        to={dept.link}
                                        className={`${dept.bg} border ${dept.border} rounded-2xl p-5 hover:shadow-md transition-all group active:scale-95`}
                                    >
                                        <div className="text-2xl mb-2">{dept.icon}</div>
                                        <div className={`text-3xl font-bold ${dept.color} mb-1`}>{count}</div>
                                        <div className="text-sm font-semibold text-[#1a1a1a] mb-1">{dept.label}</div>
                                        {pending > 0 && (
                                            <div className="text-xs text-stone-500">{pending} pending</div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="map-section grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-[500px] flex flex-col">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                Live Issue Map
                            </h2>
                            <div className="flex-1 rounded-xl overflow-hidden bg-stone-100 relative z-0">
                                <DashboardMap reports={reports} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
