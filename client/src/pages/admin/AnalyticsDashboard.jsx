import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { adminPledgeAPI, adminVolunteerAPI } from '../../services/adminApi';
import { TrendingUp, Users, HandHeart, Calendar, MapPin } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [pledgeAnalytics, setPledgeAnalytics] = useState(null);
    const [volunteerAnalytics, setVolunteerAnalytics] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const [pledgeData, volunteerData] = await Promise.all([
                adminPledgeAPI.getAnalytics(),
                adminVolunteerAPI.getAnalytics(),
            ]);

            setPledgeAnalytics(pledgeData.data);
            setVolunteerAnalytics(volunteerData.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    Analytics Dashboard
                </h1>
                <p className="text-gray-500 mt-2">Track momentum and engagement metrics</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Total Pledges</p>
                            <h3 className="text-3xl font-bold mt-2">{pledgeAnalytics?.totalPledges || 0}</h3>
                            <p className="text-green-100 text-xs mt-1">
                                +{pledgeAnalytics?.recentPledges || 0} this week
                            </p>
                        </div>
                        <HandHeart className="w-12 h-12 text-green-200 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Volunteers</p>
                            <h3 className="text-3xl font-bold mt-2">{volunteerAnalytics?.totalVolunteers || 0}</h3>
                            <p className="text-blue-100 text-xs mt-1">
                                +{volunteerAnalytics?.recentVolunteers || 0} this week
                            </p>
                        </div>
                        <Users className="w-12 h-12 text-blue-200 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Top State (Pledges)</p>
                            <h3 className="text-xl font-bold mt-2">
                                {pledgeAnalytics?.pledgesByState?.[0]?.state || 'N/A'}
                            </h3>
                            <p className="text-purple-100 text-xs mt-1">
                                {pledgeAnalytics?.pledgesByState?.[0]?.count || 0} pledges
                            </p>
                        </div>
                        <MapPin className="w-12 h-12 text-purple-200 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">30-Day Trend</p>
                            <h3 className="text-xl font-bold mt-2">
                                {pledgeAnalytics?.pledgesPerDay?.length || 0} active days
                            </h3>
                            <p className="text-orange-100 text-xs mt-1">Last 30 days</p>
                        </div>
                        <Calendar className="w-12 h-12 text-orange-200 opacity-80" />
                    </div>
                </div>
            </div>

            {/* Charts Row 1: Time Series */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pledges Per Day */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <HandHeart className="w-5 h-5 text-green-600" />
                        Pledges Per Day (Last 30 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={pledgeAnalytics?.pledgesPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Pledges"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Volunteers Per Day */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Volunteers Per Day (Last 30 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={volunteerAnalytics?.volunteersPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Volunteers"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2: Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pledges by State */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        Top 10 States (Pledges)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={pledgeAnalytics?.pledgesByState?.slice(0, 10) || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Volunteer Qualifications */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Top Volunteer Qualifications
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={volunteerAnalytics?.topQualifications || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ qualification, percent }) => `${qualification}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="qualification"
                            >
                                {(volunteerAnalytics?.topQualifications || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pledges by District */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Top 10 Districts (Pledges)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pledgeAnalytics?.pledgesByDistrict?.slice(0, 10) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="district"
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            labelFormatter={(value) => value}
                            formatter={(value, name, props) => [value, `${props.payload.state} - ${props.payload.district}`]}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
