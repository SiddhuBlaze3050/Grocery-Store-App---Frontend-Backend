const home = {
    template: `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 welcome-container" :style="containerStyle">
                    <h1 style="font-size: 3rem; font-weight: 700; color: #333;">Welcome to EZ Stores</h1>
                    <p style="font-size: 1.5rem">Your One-Stop Grocery Destination</p>
                    <router-link to="/login"> <a href="#" class="btn btn-get-started" style="background-color: #007BFF;
                    color: #fff;
                    font-size: 1.2rem;
                    padding: 15px 30px;
                    border-radius: 30px;
                    transition: background-color 0.3s;"> Get Started </a> </router-link>
                </div>
            </div>
        </div>  
    `,

    mounted: function() {
        document.title = 'Home';
    },

    data() {
        return {
            containerStyle: {
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '10px',
                marginTop: '100px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
        }
    },
}

export default home;