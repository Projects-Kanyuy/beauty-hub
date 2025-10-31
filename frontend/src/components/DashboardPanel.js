import { Link } from 'react-router-dom';
const DashboardPanel = ({ title, viewAllLink, children, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm h-full">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-lg text-text-main flex items-center space-x-2">
        <Icon className="text-primary-purple"/>
        <span>{title}</span>
      </h3>
      {viewAllLink && <Link to={viewAllLink} className="text-sm font-semibold text-primary-purple hover:underline">View All &gt;</Link>}
    </div>
    <div>{children}</div>
  </div>
);
export default DashboardPanel;