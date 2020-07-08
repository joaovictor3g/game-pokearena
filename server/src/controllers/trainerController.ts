import { Request, Response } from 'express';
import connection from '../database/connection';

const trainerController = {
    async create(req: Request, res: Response) {
        const { name, password } = req.body;
        
        await connection('trainer')
            .insert({ name, password });
        
        return res.json({ message: 'Trainer reached ten years' });
    },

    async signIn(req: Request, res: Response) {
        const { name, password } = req.body;

        const [id] = await connection('trainer')
            .select('id_trainer')
            .where('name', name)
            .where('password', password);
        
        return res.json(id);
    },

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const idPokemon = await connection('trainer')
            .join('pokemon_trainer', 'pokemon_trainer.id_trainer', '=', 'trainer.id_trainer')
            .where('trainer.id_trainer', '=', id)
            .select('pokemon_trainer.id_pokemon');

        const result = idPokemon.map(id => id.id_pokemon);


        /*if(isAlreadyNicknameExists) {
            try {
                const infoPokemon = await connection('pokemon')
                .select('*')
                .whereIn('pokemon.id_pokemon', result)
                .distinct();
            
                console.log(infoPokemon, 'entrou aqui');

                return res.json(infoPokemon);
            } catch(err) {
                console.log('deu erro')
            }
        }
        else {
            const infoPokemon = await connection('pokemon')
                .join('nickname_pokemon', 'nickname_pokemon.id_pokemon', 'pokemon.id_pokemon')
                .join('trainer', 'trainer.id_trainer', 'nickname_pokemon.id_trainer')
                .whereIn('nickname_pokemon.id_pokemon', result)
                .where('trainer.id_trainer', id)
                .select('nickname_pokemon.nickname', 'pokemon.*')
            
            console.log('entrou no else')

            return res.json(infoPokemon);   
        }*/
        const infoPokemon = await connection('pokemon')
            .select('*')
            .whereIn('pokemon.id_pokemon', result)
            .distinct();
    
            return res.json(infoPokemon);
    },

    async deletePokemon(req: Request, res: Response) {
        //const { id_trainer } = req.params;
        //const { id_pokemon } = req.body;
        const { id_trainer, id_pokemon } = req.query;
        
        const idTrainer = Number(id_trainer);
        const idPokemon = Number(id_pokemon);

        await connection('pokemon_trainer')
            .where('id_trainer', idTrainer)
            .where('id_pokemon', idPokemon)
            .del();

        return res.json({ message: 'Pokemon deleted' })
    },

    async updatePassword(req: Request, res: Response) {
        const { id_trainer, name, password } = req.body;

        await connection('trainer')
            .update('name', name)
            .update('password', password)
            .where('id_trainer', id_trainer);

        return res.json({ message: 'Update was done!!!' })
    
    },
};

export default trainerController;