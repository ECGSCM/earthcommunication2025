import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag } from 'lucide-react';

// クライアント名から色を生成する関数
const getClientColor = (clientName) => {
    // 各クライアントに固定の色を割り当て
    const clientColors = {
        'FRA学校': '#3b82f6',           // blue
        'とっとりおかやま物産展': '#ef4444', // red
        'カノッサ幼稚園': '#10b981',     // green
        'ルンビニ幼稚園': '#f59e0b',     // amber
        '信濃教育会': '#8b5cf6',         // violet
        '東中野教会': '#ec4899',         // pink
        '横浜ラーメン博物館': '#06b6d4', // cyan
        '水戸結婚式場': '#f97316',       // orange
        '清水トキ学園': '#14b8a6',       // teal
        '目黒幼稚園': '#a855f7',         // purple
    };

    // 定義されていないクライアントの場合はハッシュで色を生成
    if (clientColors[clientName]) {
        return clientColors[clientName];
    }

    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
    ];

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
