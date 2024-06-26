import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar';

function App() {
 const [formData, setFormData] = useState({
     ancho: '',
     largo: '',
     tiempo: '',
     porcentaje: ''
    });

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <NavBar />
            <header className="App-header">
                <h1>Configura tu tizada</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="ancho">Ancho:</label>
                        <input
                            type="text"
                            id="ancho"
                            name="ancho"
                            value={formData.ancho}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="largo">Largo:</label>
                        <input
                            type="text"
                            id="largo"
                            name="largo"
                            value={formData.largo}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="tiempo">Tiempo Maximo:</label>
                        <input
                            type="text"
                            id="tiempo"
                            name="tiempo"
                            value={formData.tiempo}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="porcentaje">Porcentaje de aprovechamiento de la mesa:</label>
                        <input
                            type="text"
                            id="porcentaje"
                            name="porcentaje"
                            value={formData.porcentaje}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </header>
        </div>
    );
};

export default App
