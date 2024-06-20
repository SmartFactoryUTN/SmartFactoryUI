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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form data here
        console.log(formData);
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
