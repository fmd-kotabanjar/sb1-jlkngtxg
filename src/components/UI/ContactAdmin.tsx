import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';

interface ContactAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactAdmin: React.FC<ContactAdminProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = '082246050839';
    const message = encodeURIComponent('Halo Admin RacikanPrompt, saya ingin bertanya tentang layanan Anda.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('082246050839');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy phone number:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal positioning trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Kontak Admin
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">WhatsApp</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chat langsung dengan admin</p>
                </div>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Chat di WhatsApp
              </button>
            </div>

            {/* Phone */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Telepon</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">082246050839</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                >
                  {copied ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">admin@racikanprompt.com</p>
                </div>
              </div>
              <a
                href="mailto:admin@racikanprompt.com"
                className="block w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium text-center"
              >
                Kirim Email
              </a>
            </div>

            {/* Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Jam Operasional</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
                <p>Sabtu: 09:00 - 15:00 WIB</p>
                <p>Minggu: Libur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;