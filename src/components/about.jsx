import React from 'react';
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import './about.css';


const About = () => {
    return (
        <section className='about' id='about'>
            <div className="container">
                <div className="banner">
                    <div className="top">
                        <h1 className='heading'>ABOUT US</h1>
                        <p>Dive into Deliciouness. </p>

                    </div>
                    <p className='mid'>
                    At Crave & Dine, we offer a variety of delicious, freshly prepared dishes in a warm, inviting atmosphere. Our goal is to create memorable dining experiences with exceptional service and quality ingredients.
                    </p>
                    {/* FIX: Changed Link 'to' prop from "/" to "/menu" */}
                    <Link to={"/menu"}>Explore Menu
                        <span>
                            <HiOutlineArrowNarrowRight />
                        </span>
                    </Link>
                </div>
                <div className="banner">
                    <img src='/about.png' alt='about' />
                </div>
            </div>

        </section>
    )
}

export default About;
