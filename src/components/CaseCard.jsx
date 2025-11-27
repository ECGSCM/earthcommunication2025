import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag } from 'lucide-react';

const CaseCard = ({ caseItem }) => {
    return (
        <motion.div
            className="case-card"
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
