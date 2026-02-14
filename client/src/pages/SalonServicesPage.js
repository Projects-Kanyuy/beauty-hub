import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPen, FaSpinner, FaTrash } from "react-icons/fa";
import {
  addService,
  deleteService,
  updateService,
} from "../api";
import { useActiveSubscription, useMySalon } from "../api/swr";
import AlertBox from "../components/AlertBox";
import Button from "../components/Button";
import ServiceModal from "../components/ServiceModal";
import { useAuth } from "../context/AuthContext";

const SalonServicesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const {
    data: salon,
    isLoading: loading,
    error,
    mutate,
  } = useMySalon();
  const { data: subscriptionData, isLoading: loadingSubscription } =
    useActiveSubscription(user?._id);
  const services = salon?.services || [];
  const hasActiveSubscription = !!subscriptionData?.data;

  const handleOpenModal = (service = null) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm(t("salonservices.confirmDelete"))) {
      try {
        await deleteService(salon._id, serviceId);
        mutate();
        alert(t("salonservices.deleteSuccess"));
      } catch (err) {
        console.error("Failed to delete service:", err);
        alert(
          t("salonservices.deleteError", {
            error: err.response?.data?.message || err.message,
          })
        );
      }
    }
  };

  const handleFormSubmit = async (serviceData) => {
    try {
      if (editingService) {
        await updateService(salon._id, editingService._id, serviceData);
        alert(t("salonservices.updateSuccess"));
      } else {
        await addService(salon._id, serviceData);
        alert(t("salonservices.addSuccess"));
      }
      handleCloseModal();
      mutate();
    } catch (err) {
      console.error("Failed to save service:", err);
      alert(
        t("salonservices.saveError", {
          error: err.response?.data?.message || err.message,
        })
      );
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  if (loading || loadingSubscription)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-purple" />
      </div>
    );
  if (!hasActiveSubscription)
    return (
      <AlertBox
        title={t("salondashboard.noSubscription")}
        message={t("salondashboard.subscribeToUnlock")}
        type="warning"
        actionLabel={t("salondashboard.choosePlan")}
        actionLink="/subscriptions"
      />
    );
  if (error)
    return (
      <AlertBox
        title={t("salonservices.loadError")}
        message={t("salonservices.loadError")}
        type="error"
        onRetry={() => window.location.reload()}
      />
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">
          {t("salonservices.header")}
        </h1>
        <Button variant="gradient" onClick={() => handleOpenModal()}>
          {t("salonservices.addButton")}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 font-semibold">
                  {t("salonservices.table.name")}
                </th>
                <th className="p-4 font-semibold">
                  {t("salonservices.table.price")}
                </th>
                <th className="p-4 font-semibold">
                  {t("salonservices.table.duration")}
                </th>
                <th className="p-4 font-semibold">
                  {t("salonservices.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-text-muted truncate max-w-xs">
                        {service.description}
                      </p>
                    </td>
                    <td className="p-4">{formatPrice(service.price)}</td>
                    <td className="p-4">
                      {service.duration} {t("salonservices.minutes")}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaPen />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-muted">
                    {t("salonservices.noServices")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingService}
      />
    </div>
  );
};

export default SalonServicesPage;
