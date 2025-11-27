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
                    {caseItem.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            <Tag size={12} /> {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CaseCard;
