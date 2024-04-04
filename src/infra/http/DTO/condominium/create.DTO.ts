import { condominiumRules } from '@app/entities/_rules/condominium';
import { globalRules } from '@app/entities/_rules/global';
import {
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

export class CreateCondominiumDTO {
	@IsString({
		message: 'O nome do condomínio precisa conter caracteres válidos',
	})
	@MaxLength(globalRules.name.maxLength, {
		message: `O nome do condomínio precisa conter no máximo ${globalRules.name.maxLength} caracteres`,
	})
	@MinLength(globalRules.name.minLength, {
		message: `O nome do condomínio precisa conter no mínimo ${globalRules.name.minLength} caracteres`,
	})
		name: string;

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

	@IsString({
		message: 'A referência precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.reference.maxLength, {
		message: `A referência precisa conter no máximo ${condominiumRules.reference.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.reference.minLength, {
		message: `A referência precisa conter no mínimo ${condominiumRules.reference.minLength} caracteres`,
	})
	@IsOptional()
		reference: string;

	@IsString({
		message: 'O complemento precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.complement.maxLength, {
		message: `O complemento precisa conter no máximo ${condominiumRules.complement.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.complement.minLength, {
		message: `O complemento precisa conter no mínimo ${condominiumRules.complement.minLength} caracteres`,
	})
	@IsOptional()
		complement: string;

	@IsString({
		message: 'O bairro precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.district.maxLength, {
		message: `O bairro precisa conter no máximo ${condominiumRules.district.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.district.minLength, {
		message: `O bairro precisa conter no mínimo ${condominiumRules.district.minLength} caracteres`,
	})
		district: string;

	@IsString({
		message: 'A cidade precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.city.maxLength, {
		message: `A cidade precisa conter no máximo ${condominiumRules.city.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.city.minLength, {
		message: `A cidade precisa conter no mínimo ${condominiumRules.city.minLength} caracteres`,
	})
		city: string;

	@IsString({
		message: 'O estado precisa conter caracteres válidos',
	})
	@MaxLength(condominiumRules.state.maxLength, {
		message: `O estado precisa conter no máximo ${condominiumRules.state.maxLength} caracteres`,
	})
	@MinLength(condominiumRules.state.minLength, {
		message: `O estado precisa conter no mínimo ${condominiumRules.state.minLength} caracteres`,
	})
		state: string;
}
