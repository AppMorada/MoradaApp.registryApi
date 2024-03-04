import { condominiumDTORules } from '@app/entities/condominium';
import { userDTORules } from '@app/entities/user';
import {
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

/** Usado para validar o corpo das requisições de criação de condomínio */
export class CreateCondominiumDTO {
	@IsString({
		message: 'O nome do usuário precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.name.maxLength, {
		message: `O nome do usuário precisa conter no máximo ${userDTORules.name.maxLength} caracteres`,
	})
	@MinLength(userDTORules.name.minLength, {
		message: `O nome do usuário precisa conter no mínimo ${userDTORules.name.minLength} caracteres`,
	})
		userName: string;

	@IsString({
		message: 'O email do usuário precisa conter caracteres válidos',
	})
	@IsEmail(
		{},
		{
			message: 'O email do usuário precisa ser um email válido',
		},
	)
	@MaxLength(userDTORules.email.maxLength, {
		message: `O email do usuário precisa conter no máximo ${userDTORules.email.maxLength} caracteres`,
	})
		email: string;

	@IsString({
		message: 'A senha precisa conter caracteres válidos',
	})
	@MaxLength(userDTORules.password.maxLength, {
		message: `A senha precisa conter no máximo ${userDTORules.password.maxLength} caracteres`,
	})
	@MinLength(userDTORules.password.minLength, {
		message: `A senha precisa conter no mínimo ${userDTORules.password.minLength} caracteres`,
	})
		password: string;

	@IsString({
		message: 'O CPF precisa conter caracteres válidos',
	})
	@MinLength(userDTORules.CPF.minLength, {
		message: `O CPF precisa conter no mínimo ${userDTORules.CPF.minLength} caracteres`,
	})
	@MaxLength(userDTORules.CPF.maxLength, {
		message: `O CPF precisa conter no máximo ${userDTORules.CPF.maxLength} caracteres`,
	})
		CPF: string;

	@IsString({
		message: 'O nome do condomínio precisa conter caracteres válidos',
	})
	@MaxLength(condominiumDTORules.name.maxLength, {
		message: `O nome do condomínio precisa conter no máximo ${condominiumDTORules.name.maxLength} caracteres`,
	})
	@MinLength(condominiumDTORules.name.minLength, {
		message: `O nome do condomínio precisa conter no mínimo ${condominiumDTORules.name.minLength} caracteres`,
	})
		condominiumName: string;

	@IsString({
		message: 'O CEP precisa conter caracteres válidos',
	})
	@MinLength(condominiumDTORules.CEP.minLength, {
		message: `O CEP precisa conter no mínimo ${condominiumDTORules.CEP.minLength} caracteres`,
	})
	@MaxLength(condominiumDTORules.CEP.maxLength, {
		message: `O CEP precisa conter no máximo ${condominiumDTORules.CEP.maxLength} caracteres`,
	})
		CEP: string;

	@IsNumber(
		{},
		{
			message: 'O número da rua do condomínio precisa ser um número',
		},
	)
	@Max(condominiumDTORules.num.maxLength, {
		message: `O número da rua do condomínio precisa ser menor ou igual a ${condominiumDTORules.num.maxLength}`,
	})
	@Min(condominiumDTORules.num.minLength, {
		message: `O número da rua do condomínio precisa ser maior ou igual a ${condominiumDTORules.num.minLength}`,
	})
		num: number;

	@IsString({
		message: 'O CNPJ precisa conter caracteres válidos',
	})
	@MaxLength(condominiumDTORules.CNPJ.maxLength, {
		message: `O CNPJ precisa conter no máximo ${condominiumDTORules.CNPJ.maxLength} caracteres`,
	})
	@MinLength(condominiumDTORules.CNPJ.minLength, {
		message: `O CNPJ precisa conter no mínimo ${condominiumDTORules.CNPJ.minLength} caracteres`,
	})
		CNPJ: string;
}
