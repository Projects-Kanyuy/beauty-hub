import { Link } from 'react-router-dom';
const QuickActionCard = ({ icon: Icon, label, description, link, notificationCount }) => (
  <Link to={link} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center">
    {notificationCount > 0 && (
      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{notificationCount}</span>
    )}
    <div className="text-3xl text-white p-3 rounded-lg bg-gradient-to-br from-primary-pink to-primary-purple mb-3">
      <Icon />
    </div>
    <h3 className="font-bold text-text-main">{label}</h3>
    <p className="text-sm text-text-muted">{description}</p>
  </Link>
);
export default QuickActionCard;