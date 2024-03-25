import { condominiumRules } from '@app/entities/_rules/condominium';
import { userRules } from '@app/entities/_rules/user';
import { globalRules } from '@app/entities/_rules/global';
import {
	IsEmail,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreateCondominiumDTO {
	@IsString({
		message: 'O nome do usuário precisa conter caracteres válidos',
	})
	@MaxLength(globalRules.name.maxLength, {
		message: `O nome do usuário precisa conter no máximo ${globalRules.name.maxLength} caracteres`,
	})
	@MinLength(globalRules.name.minLength, {
		message: `O nome do usuário precisa conter no mínimo ${globalRules.name.minLength} caracteres`,
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
	@MaxLength(userRules.email.maxLength, {
		message: `O email do usuário precisa conter no máximo ${userRules.email.maxLength} caracteres`,
	})
		email: string;

	@IsString({
		message: 'A senha precisa conter caracteres válidos',
	})
	@MaxLength(userRules.password.maxLength, {
		message: `A senha precisa conter no máximo ${userRules.password.maxLength} caracteres`,
	})
	@MinLength(userRules.password.minLength, {
		message: `A senha precisa conter no mínimo ${userRules.password.minLength} caracteres`,
	})
		password: string;

	@IsString({
		message: 'O nome do condomínio precisa conter caracteres válidos',
	})
	@MaxLength(globalRules.name.maxLength, {
		message: `O nome do condomínio precisa conter no máximo ${globalRules.name.maxLength} caracteres`,
	})
	@MinLength(globalRules.name.minLength, {
		message: `O nome do condomínio precisa conter no mínimo ${globalRules.name.minLength} caracteres`,
	})
		condominiumName: string;

	@IsString({
		message: 'O CEP precisa conter caracteres válidos',
	})
	@MinLength(condominiumRules.CEP.minLength, {
		message: `O CEP precisa conter no mínimo ${condominiumRules.CEP.minLength} caracteres`,
	})
	@MaxLength(condominiumRules.CEP.maxLength, {
		message: `O CEP precisa conter no máximo ${condominiumRules.CEP.maxLength} caracteres`,
	})
		CEP: string;

	@IsNumber(
		{},
		{
			message: 'O número da rua do condomínio precisa ser um número',
		},
	)
	@Max(condominiumRules.num.maxLength, {
		message: `O número da rua do condomínio precisa ser menor ou igual a ${condominiumRules.num.maxLength}`,
	})
	@Min(condominiumRules.num.minLength, {
		message: `O número da rua do condomínio precisa ser maior ou igual a ${condominiumRules.num.minLength}`,
	})
		num: number;

	@IsString({
		message: 'O CNPJ precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.CNPJ.maxLength, {
		message: `O CNPJ precisa conter no máximo ${condominiumRules.CNPJ.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.CNPJ.minLength, {
		message: `O CNPJ precisa conter no mínimo ${condominiumRules.CNPJ.minLength} caracteres`,
	})
		CNPJ: string;
}
