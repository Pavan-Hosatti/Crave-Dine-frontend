import React from 'react';
import { motion } from 'framer-motion';
import { data } from "../../restApi.json";
import './Qualities.css';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      type: 'spring',
    }
  })
};

const Qualities = () => {
  return (
    <section className='qualities' id='qualities'>
      <div className="container">

        <motion.div
          className="qualities-heading"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Why Choose Us?</h2>
          <p className="subtitle">Serving flavor, speed, and quality like no one else.</p>
          <div className="shine" />
        </motion.div>

        <div className="cards-wrapper">
          {
            data[0].ourQualities.map((element, index) => (
              <motion.div
                className="card tilt-card"
                key={element.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img src={element.image} alt={element.title} />
                <p className='title'>{element.title}</p>
                <p className='description'>{element.description}</p>
              </motion.div>
            ))
          }
        </div>

      </div>
    </section>
  );
};

export default Qualities;
