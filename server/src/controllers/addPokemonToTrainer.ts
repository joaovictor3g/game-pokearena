import { Request, Response } from 'express';
import connection from '../database/connection';

const addPokemonToTrainer = {
    async create(req: Request, res: Response) { 
        const { id } = req.params;
        const { idsPokemon } = req.body;

        const trx = await connection.transaction();

        const id_trainer = Number(id);

        const insertPokemonAndTrainer = idsPokemon
            .split(',')
            .map((idPokemon: string) => Number(idPokemon.trim()))
            .map((id_pokemon: number) => {
                return {
                    id_pokemon,
                    id_trainer
                }
            });

        await trx('pokemon_trainer')
            .insert(insertPokemonAndTrainer);

        await trx.commit();
        
        return res.json({ id: id_trainer });
    },

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const response =  await connection('pokemon_trainer')
            .select('*')
            .where('pokemon_trainer.id_trainer', id)
        
        
        return res.json(response)
    },
};

export default addPokemonToTrainer;