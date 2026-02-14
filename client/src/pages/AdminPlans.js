import { useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  updateSubscriptionPlan,
} from "../api";
import { useSubscriptionPlans } from "../api/swr";

const EMPTY_FORM = {
  planName: "",
  description: "",
  amount: "",
  currency: "XAF",
  durationMonths: "1",
  planSpecs: "",
};

const AdminPlans = () => {
  const { data: plans = [], isLoading, error } = useSubscriptionPlans();
  const { mutate } = useSWRConfig();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const normalizedPlans = useMemo(
    () =>
      Array.isArray(plans)
        ? [...plans].sort((a, b) =>
            (a.planName || "").localeCompare(b.planName || "")
          )
        : [],
    [plans]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const toSpecsArray = (value) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      planName: form.planName.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      currency: form.currency,
      durationMonths: Number(form.durationMonths),
      planSpecs: toSpecsArray(form.planSpecs),
    };

    if (!payload.planName || !payload.amount || !payload.durationMonths) {
      toast.error("Plan name, amount, and duration are required.");
      return;
    }
    if (!payload.planSpecs.length) {
      toast.error("Please add at least one plan feature.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateSubscriptionPlan(editingId, payload);
        toast.success("Plan updated.");
      } else {
        await createSubscriptionPlan(payload);
        toast.success("Plan created.");
      }
      await mutate("/api/subscription-types");
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      planName: plan.planName || "",
      description: plan.description || "",
      amount: plan.amount ?? "",
      currency: plan.currency || "XAF",
      durationMonths: plan.durationMonths || 1,
      planSpecs: (plan.planSpecs || []).join("\n"),
    });
  };

  const handleDelete = async (planId) => {
    const confirmed = window.confirm(
      "Delete this plan? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteSubscriptionPlan(planId);
      toast.success("Plan deleted.");
      await mutate("/api/subscription-types");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete plan.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
        <p className="text-sm text-gray-500">
          Create and manage subscription plans available to salon owners.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaPlus className="text-primary-purple" />
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Plan" : "Create Plan"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plan name
            </label>
            <input
              name="planName"
              value={form.planName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="e.g. Pro"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Short summary shown on pricing cards"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              name="amount"
              type="number"
              min="0"
              step="1"
              value={form.amount}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="15000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            >
              <option value="XAF">XAF</option>
              <option value="USD">USD</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Payments currently support XAF only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Duration (months)
            </label>
            <input
              name="durationMonths"
              type="number"
              min="1"
              step="1"
              value={form.durationMonths}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Plan features (one per line)
            </label>
            <textarea
              name="planSpecs"
              value={form.planSpecs}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder="Unlimited bookings&#10;Priority support&#10;Analytics dashboard"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-purple px-4 py-2 text-white font-semibold hover:bg-primary-pink transition"
            >
              <FaSave />
              {submitting ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Available Plans</h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-gray-500">Loading plans...</div>
        ) : error ? (
          <div className="p-6 text-red-600">
            Failed to load plans. Please try again.
          </div>
        ) : normalizedPlans.length === 0 ? (
          <div className="p-6 text-gray-500">No plans found.</div>
        ) : (
          <div className="divide-y">
            {normalizedPlans.map((plan) => (
              <div
                key={plan._id}
                className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {plan.planName}
                    </h3>
                    <span className="text-xs uppercase tracking-wide text-gray-400">
                      {plan.currency} {plan.amount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {(plan.planSpecs || []).map((spec, idx) => (
                      <li key={`${plan._id}-spec-${idx}`}>{spec}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlans;
