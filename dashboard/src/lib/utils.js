import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  if (days < 7) return `منذ ${days} يوم`;

  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getScoreColor(score) {
  if (score >= 8) return "#34d399";
  if (score >= 6) return "#fbbf24";
  if (score >= 4) return "#fb923c";
  return "#f87171";
}

export function getStatusBadge(status) {
  const map = {
    new: { label: "جديد", class: "badge-new" },
    contacted: { label: "تم التواصل", class: "badge-contacted" },
    converted: { label: "تم التحويل", class: "badge-converted" },
    lost: { label: "مفقود", class: "badge-lost" },
  };
  return map[status] || map.new;
}

export function getSourceBadge(source) {
  const map = {
    comment: { label: "كومنت", class: "badge-comment" },
    messenger: { label: "ماسنجر", class: "badge-messenger" },
    instagram: { label: "انستجرام", class: "badge-instagram" },
  };
  return map[source] || map.comment;
}

export function calcChange(current, previous) {
  if (previous === 0) return { value: 100, positive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    positive: change >= 0,
  };
}
