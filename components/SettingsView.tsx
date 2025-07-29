import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, User, AuditLog, ToastData } from '../types';
import BusinessInfoSettings from './settings/BusinessInfoSettings';
import TaxSettings from './settings/TaxSettings';
import UsersPermissionsSettings from './settings/UsersPermissionsSettings';
import EmailSettings from './settings/EmailSettings';
import ReceiptSettings from './settings/ReceiptSettings';
import DataBackupSettings from './settings/DataBackupSettings';
import AuditLogSettings from './settings/AuditLogSettings';
import FactoryResetSettings from './settings/FactoryResetSettings';
import LoyaltySettings from './settings/LoyaltySettings';
import DiscountSettings from './settings/DiscountSettings';

interface SettingsViewProps {
    settings: Settings;
    onUpdateSettings: (settings: Partial<Settings>) => void;
    users: User[];
    onAddUser: (user: Omit<User, 'id'>) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
    auditLogs: AuditLog[];
    showToast: (message: string, type: ToastData['type']) => void;
    onBackup: () => void;
    onRestore: (data: any) => void;
    onFactoryReset: () => void;
}

const SettingsModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="bg-slate-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white rounded-t-xl flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="p-6 overflow-y-auto">
                {children}
            </div>
        </motion.div>
    </motion.div>
);

const SettingsCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <motion.div
        onClick={onClick}
        className="bg-white p-6 rounded-xl shadow-md cursor-pointer flex flex-col justify-between h-full"
        whileHover={{ y: -5, scale: 1.03, boxShadow: "0px 10px 20px -3px rgba(0,0,0,0.07)" }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        <div>
            <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 flex-grow">{description}</p>
        </div>
        <div className="text-right mt-4 text-sm font-semibold text-emerald-600">
            Manage &rarr;
        </div>
    </motion.div>
);

const SettingsView: React.FC<SettingsViewProps> = (props) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const ICONS = {
        business: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        tax: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
        discount: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v-5c0-1.1.9-2 2-2z" /></svg>,
        users: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        loyalty: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 10v4m-2-2h4M5 3a2 2 0 00-2 2v1.28aM5 21a2 2 0 01-2-2V7.28aM19 3a2 2 0 012 2v1.28A2 2 0 0119 9M19 21a2 2 0 002-2V7.28" /></svg>,
        email: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        receipt: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>,
        data: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
        audit: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        reset: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    };

    const settingsConfig = {
        'business-info': {
            title: 'Business Information',
            description: 'Set your company name, KRA PIN, logo, and location.',
            icon: ICONS.business,
            component: <BusinessInfoSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} showToast={props.showToast} />,
        },
        'receipt-settings': {
            title: 'Receipt & Invoice',
            description: 'Customize receipt footers and document numbering.',
            icon: ICONS.receipt,
            component: <ReceiptSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} />,
        },
        'tax-config': {
            title: 'VAT & Tax',
            description: 'Configure VAT rates and default product pricing.',
            icon: ICONS.tax,
            component: <TaxSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} />,
        },
        'discount-settings': {
            title: 'Discounts',
            description: 'Enable and set limits for POS transaction discounts.',
            icon: ICONS.discount,
            component: <DiscountSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} />,
        },
        'loyalty-settings': {
            title: 'Loyalty Program',
            description: 'Manage how customers earn and redeem loyalty points.',
            icon: ICONS.loyalty,
            component: <LoyaltySettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} />,
        },
        'users-perms': {
            title: 'Users & Permissions',
            description: 'Add or remove staff, and manage their access roles.',
            icon: ICONS.users,
            component: <UsersPermissionsSettings {...props} />,
        },
        'email-settings': {
            title: 'Email (SMTP)',
            description: 'Configure settings for sending emails from the system.',
            icon: ICONS.email,
            component: <EmailSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} showToast={props.showToast} />,
        },
        'audit-logs': {
            title: 'Audit Logs',
            description: 'View a log of all important actions taken in the system.',
            icon: ICONS.audit,
            component: <AuditLogSettings auditLogs={props.auditLogs} users={props.users} />,
        },
        'data-backup': {
            title: 'Data & Backup',
            description: 'Download a backup of all data or restore from a file.',
            icon: ICONS.data,
            component: <DataBackupSettings showToast={props.showToast} onBackup={props.onBackup} onRestore={props.onRestore} />,
        },
        'factory-reset': {
            title: 'Factory Reset',
            description: 'Wipe all data and reset the system to its default state.',
            icon: ICONS.reset,
            component: <FactoryResetSettings showToast={props.showToast} onFactoryReset={props.onFactoryReset} />,
        },
    };

    const categories = [
        {
            title: "Store Setup",
            items: ['business-info', 'receipt-settings', 'email-settings']
        },
        {
            title: "Financials & Sales",
            items: ['tax-config', 'discount-settings', 'loyalty-settings']
        },
        {
            title: "System & Security",
            items: ['users-perms', 'audit-logs']
        },
        {
            title: "Data Management",
            items: ['data-backup', 'factory-reset']
        }
    ];

    const activeSettingData = activeModal ? settingsConfig[activeModal] : null;

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-slate-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Admin Settings</h1>
                <p className="mt-1 text-slate-500">Manage your system configurations and security settings.</p>
            </div>
            
            <div className="space-y-8">
                {categories.map(category => (
                    <div key={category.title}>
                        <h2 className="text-xl font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200">{category.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.items.map(itemId => {
                                const item = settingsConfig[itemId];
                                if (!item) return null;
                                return (
                                    <SettingsCard
                                        key={itemId}
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        onClick={() => setActiveModal(itemId)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {activeModal && activeSettingData && (
                    <SettingsModal title={activeSettingData.title} onClose={() => setActiveModal(null)}>
                        {activeSettingData.component}
                    </SettingsModal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsView;