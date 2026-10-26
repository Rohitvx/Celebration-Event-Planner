import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Utensils,
  Camera,
  Music,
  Sparkles,
} from 'lucide-react';
import type { EventPlan, VendorItem, BudgetCategory, ExpenseItem } from '../../types/event';
import { CATEGORY_METADATA, formatINR } from '../../services/budgetTemplates';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface VendorManagerProps {
  event: EventPlan;
  onUpdateEvent: (updated: EventPlan) => void;
}

export const VendorManager: React.FC<VendorManagerProps> = ({ event, onUpdateEvent }) => {
  const [filterCategory, setFilterCategory] = useState<BudgetCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);

  // Form states for Add/Edit Vendor
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<BudgetCategory>('catering');
  const [vContact, setVContact] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPrice, setVPrice] = useState<number>(25000);
  const [vStatus, setVStatus] = useState<'inquiry' | 'quote_received' | 'shortlisted' | 'booked' | 'rejected'>('quote_received');
  const [vRating, setVRating] = useState<number>(4.8);
  const [vNotes, setVNotes] = useState('');
  const [vLocation, setVLocation] = useState(event.location);
  const [syncToBudget, setSyncToBudget] = useState(true);

  const filteredVendors = event.vendors.filter((v) => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const handleOpenAddModal = (cat?: BudgetCategory) => {
    setEditingVendorId(null);
    setVName('');
    setVCategory(cat || 'catering');
    setVContact('');
    setVPhone('+91 ');
    setVEmail('');
    setVPrice(25000);
    setVStatus('quote_received');
    setVRating(4.8);
    setVNotes('');
    setVLocation(event.location);
    setSyncToBudget(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vendor: VendorItem) => {
    setEditingVendorId(vendor.id);
    setVName(vendor.name);
    setVCategory(vendor.category);
    setVContact(vendor.contactPerson);
    setVPhone(vendor.phone);
    setVEmail(vendor.email);
    setVPrice(vendor.estimatedPrice);
    setVStatus(vendor.status);
    setVRating(vendor.rating);
    setVNotes(vendor.notes);
    setVLocation(vendor.location || event.location);
    setSyncToBudget(false);
    setIsModalOpen(true);
  };

  const handleSaveVendor = () => {
    if (!vName.trim()) return;

    let updatedVendors: VendorItem[];
    let updatedExpenses = [...event.expenses];

    if (editingVendorId) {
      updatedVendors = event.vendors.map((v) =>
        v.id === editingVendorId
          ? {
              ...v,
              name: vName.trim(),
              category: vCategory,
              contactPerson: vContact.trim(),
              phone: vPhone.trim(),
              email: vEmail.trim(),
              estimatedPrice: Number(vPrice) || 0,
              status: vStatus,
              rating: vRating,
              notes: vNotes.trim(),
              location: vLocation.trim(),
            }
          : v
      );
    } else {
      const newVendor: VendorItem = {
        id: `v-${Date.now()}`,
        name: vName.trim(),
        category: vCategory,
        contactPerson: vContact.trim(),
        phone: vPhone.trim(),
        email: vEmail.trim(),
        estimatedPrice: Number(vPrice) || 0,
        status: vStatus,
        rating: vRating,
        notes: vNotes.trim(),
        location: vLocation.trim(),
      };
      updatedVendors = [...event.vendors, newVendor];

      // Automatically sync as budget expense if selected
      if (syncToBudget) {
        const newExpense: ExpenseItem = {
          id: `exp-from-v-${Date.now()}`,
          category: vCategory,
          name: `${vName.trim()} Quote`,
          plannedAmount: Number(vPrice) || 0,
          actualAmount: vStatus === 'booked' ? Number(vPrice) || 0 : 0,
          status: vStatus === 'booked' ? 'deposit_paid' : 'pending',
          notes: `Vendor: ${vContact.trim()} (${vPhone.trim()})`,
          vendorId: newVendor.id,
        };
        updatedExpenses.push(newExpense);
      }
    }

    onUpdateEvent({
      ...event,
      vendors: updatedVendors,
      expenses: updatedExpenses,
    });
    setIsModalOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    const updatedVendors = event.vendors.filter((v) => v.id !== id);
    onUpdateEvent({
      ...event,
      vendors: updatedVendors,
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#121422] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Service Providers & Venues
              </span>
              <span className="text-xs text-slate-400">Location: {event.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Vendor Directory & Quotations
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Compare estimates, review ratings, track bookings, and sync directly with your budget.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Custom Vendor</span>
            </button>
          </div>
        </div>

        {/* Demo Notice Disclaimer (Per Prompt Requirements) */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Sample Listings Notice:</strong> Vendor names and contact details shown are curated sample listings calibrated to realistic Indian market price benchmarks for {event.location}.
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1">Category:</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-xl font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {Object.keys(CATEGORY_METADATA).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat as BudgetCategory)}
              className={`px-2.5 py-1 rounded-xl font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {CATEGORY_METADATA[cat as BudgetCategory].name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="inquiry">Inquiry</option>
            <option value="quote_received">Quote Received</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="booked">Booked</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 rounded-2xl bg-slate-900/60 border border-slate-800">
            No vendors found for this filter.{' '}
            <button
              onClick={() => handleOpenAddModal(filterCategory === 'all' ? undefined : filterCategory)}
              className="text-purple-400 underline font-semibold ml-1"
            >
              Add a new vendor
            </button>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-6 shadow-xl flex flex-col justify-between transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge category={vendor.category} />
                      <StatusBadge status={vendor.status} />
                    </div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">{vendor.name}</h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-300" />
                    <span>{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{vendor.notes}</p>

                {/* Contact & Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 truncate">
                    <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{vendor.contactPerson || 'Vendor Lead'}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{vendor.location || event.location}</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Estimated Quote
                  </span>
                  <span className="text-lg font-extrabold text-amber-300 font-['Outfit']">
                    {formatINR(vendor.estimatedPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(vendor)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Vendor"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Vendor"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendorId ? 'Edit Vendor Details' : 'Add New Vendor Listing'}
        subtitle="Manage service quotes and vendor contact specs"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Vendor Name *
              </label>
              <input
                type="text"
                value={vName}
                onChange={(e) => setVName(e.target.value)}
                placeholder="e.g. Royal Spice Catering, DJ Rayne"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Service Category
              </label>
              <select
                value={vCategory}
                onChange={(e) => setVCategory(e.target.value as BudgetCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                {Object.keys(CATEGORY_METADATA).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_METADATA[cat as BudgetCategory].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Person
              </label>
              <input
                type="text"
                value={vContact}
                onChange={(e) => setVContact(e.target.value)}
                placeholder="e.g. Sanjay Verma"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={vPhone}
                onChange={(e) => setVPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Price / Quote (INR)
              </label>
              <input
                type="number"
                step="1000"
                value={vPrice}
                onChange={(e) => setVPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Booking Status
              </label>
              <select
                value={vStatus}
                onChange={(e) => setVStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option value="inquiry">Inquiry Sent</option>
                <option value="quote_received">Quote Received</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="booked">Booked</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service Scope & Notes
            </label>
            <textarea
              rows={2}
              value={vNotes}
              onChange={(e) => setVNotes(e.target.value)}
              placeholder="e.g. Includes stage lighting, 2 microphones, and 4 hours DJ performance."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          {!editingVendorId && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="syncBudgetCheck"
                checked={syncToBudget}
                onChange={(e) => setSyncToBudget(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="syncBudgetCheck" className="text-xs text-slate-300">
                Automatically add this quote into my <strong>Budget Planner</strong> as an itemized expense
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveVendor}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Save Vendor
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
