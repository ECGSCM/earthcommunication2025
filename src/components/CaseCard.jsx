import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag } from 'lucide-react';

// クライアント名から色を生成する関数
const getClientColor = (clientName) => {
    const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#f97316', // orange
    ];

    // クライアント名から一意のインデックスを生成
    let hash = 0;
    for (let i = 0; i < clientName.length; i++) {
        hash = clientName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

// タグごとに色を割り当てる関数
const getTagColor = (tagName) => {
    const tagColors = {
        '映像': { bg: '#dbeafe', text: '#1e40af' }, // blue
        '音響': { bg: '#dcfce7', text: '#166534' }, // green
        'マイク': { bg: '#fef3c7', text: '#92400e' }, // amber
        '学校': { bg: '#e0e7ff', text: '#3730a3' }, // indigo
        '幼稚園': { bg: '#fce7f3', text: '#9f1239' }, // pink
        '教育施設': { bg: '#e9d5ff', text: '#6b21a8' }, // purple
        '教会': { bg: '#cffafe', text: '#155e75' }, // cyan
        '博物館': { bg: '#fed7aa', text: '#9a3412' }, // orange
        '結婚式場': { bg: '#fecdd3', text: '#be123c' }, // rose
        'イベント': { bg: '#c7d2fe', text: '#4338ca' }, // violet
    };

    return tagColors[tagName] || { bg: '#f3f4f6', text: '#374151' }; // default gray
};

const CaseCard = ({ caseItem }) => {
    const borderColor = getClientColor(caseItem.client);

    return (
        <motion.div
            className="case-card"
            style={{
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: `0 0 0 1px ${borderColor}20`
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <div className="image-container">
                <img src={caseItem.image} alt={caseItem.description} loading="lazy" />
                <div className="overlay">
                    <span className="category-badge">{caseItem.category}</span>
                </div>
            </div>
            <div className="content">
                <h3 className="client-name">{caseItem.client}</h3>
                <p className="description">{caseItem.description}</p>
                <div className="tags">
                    {caseItem.tags.map((tag, index) => {
                        const tagColor = getTagColor(tag);
                        return (
                            <span
                                key={index}
                                className="tag"
                                style={{
                                    backgroundColor: tagColor.bg,
                                    color: tagColor.text,
                                    border: `1px solid ${tagColor.text}30`
                                }}
                            >
                                <Tag size={12} /> {tag}
                            </span>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default CaseCard;
