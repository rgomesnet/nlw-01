import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (headerProps) => {
    return (
        <header>
            <h1>{headerProps.title}</h1>
        </header>
    );
}

export default Header;